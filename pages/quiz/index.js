/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../../db.json';
import Widget from '../../src/components/Widget';
import QuizLogo from '../../src/components/QuizLogo';
import QuizBackground from '../../src/components/QuizBackground';
import QuizContainer from '../../src/components/QuizContainer';
import GitHubCorner from '../../src/components/GitHubCorner';
import AlternativesForm from '../../src/components/AlternativesForm';
import Button from '../../src/components/Button';
import PokemonImage from '../../src/components/PokemonImage';

function ResultWidget({ results }) {
  const acertos = results.filter((x) => x).length;
  const router = useRouter();
  const name = router.asPath.split('=')[1];

  return (
    <Widget>
      <Widget.Header>
        <h1>Resultado</h1>
      </Widget.Header>

      <Widget.Content>
        <p>{`Você acertou ${acertos} pergunta${acertos === 1 ? '' : 's'}.`}</p>
        {acertos === 0 && <p>{`${name}, tem certeza que você já assistiu ou jogou pokémon?`}</p>}
        {acertos === 1 && <p>{`${name}, você pode se considerar um trienador novato.`}</p>}
        {acertos === 2 && <p>{`${name}, você é definitivamente um treinador pokémon!`}</p>}
        {acertos === 3 && <p>{`Você é a personificação da Pokédex, parabéns ${name}!`}</p>}

        <ul>
          {/* eslint-disable-next-line react/prop-types */}
          {results.map((result, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`result__${index}`}>
              {`#${index + 1} Resultado: ${result ? 'Acertou' : 'Errou'}`}
            </li>
          ))}
        </ul>

        <Button onClick={() => router.back()}>JOGAR NOVAMENTE</Button>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        Carregando questões...
      </Widget.Content>
    </Widget>
  );
}

// eslint-disable-next-line react/prop-types
function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const [hasAlternativeSelected, setHasAlternativeSelected] = useState(false);

  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
        <h1>{question.title}</h1>
      </Widget.Header>
      <Widget.Content>
        <AlternativesForm onSubmit={(e) => {
          e.preventDefault();
          setIsQuestionSubmited(true);
          setHasAlternativeSelected(false);

          setTimeout(() => {
            addResult(isCorrect);
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined);
            onSubmit();
          }, 2 * 1000);
        }}
        >
          <PokemonImage src={question.image} visible={isQuestionSubmited} />
          {/* eslint-disable-next-line react/prop-types */}
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  id={alternativeId}
                  name={questionId}
                  onChange={() => {
                    setSelectedAlternative(alternativeIndex);
                    setHasAlternativeSelected(true);
                  }}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          }) /* saber se tem selecionada e disabled no botão */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            CONFIRMAR
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

function getRandomIntInclusive(min, max) {
  /* eslint-disable no-param-reassign */
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateQuestions = async () => {
  try {
    const questions = []; // todas as questões

    for (let i = 0; i < 3; i += 1) {
      const question = {};
      const pokemonId = [];

      question.title = 'Quem é esse pokémon?';
      question.answer = getRandomIntInclusive(0, 3);
      question.alternatives = [];

      for (let j = 0; j < 4; j += 1) {
        let newPokemonId = getRandomIntInclusive(1, 386);

        // não repetir o nome do pokémon
        while (pokemonId.indexOf(newPokemonId) !== -1) {
          newPokemonId = getRandomIntInclusive(1, 386);
        }
        pokemonId.push(newPokemonId);

        // eslint-disable-next-line no-await-in-loop
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonId}`)
          .then((response) => response.json());

        if (j === question.answer) {
          question.image = pokemon.sprites.other.dream_world.front_default;
        }
        question.alternatives.push(pokemon.name);
      }

      questions.push(question);
    }

    return questions;
  } catch (err) {
    throw new Error('Deu ruim:(');
  }
};

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ dataBase = db }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [totalQuestions, setTotalQuestions] = useState(dataBase.questions.length);
  const [results, setResults] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;

  useEffect(() => {
    // se o banco de dados não tiver questões, gerá-las aleatoriamente
    if (dataBase.questions.length === 0) {
      generateQuestions().then((response) => {
        dataBase.questions = response;
        setTotalQuestions(response.length);
        setScreenState(screenStates.QUIZ);
      });
    } else {
      setScreenState(screenStates.QUIZ);
    }
  }, []);

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={dataBase.bg}>
      <Head>
        <title>Quem é esse pokémon?</title>
      </Head>

      <QuizContainer>
        <QuizLogo />
        {screenState === 'LOADING' && <LoadingWidget />}

        {screenState === 'QUIZ' && (
          <QuestionWidget
            // eslint-disable-next-line react/destructuring-assignment
            question={dataBase.questions[currentQuestion]}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
            addResult={addResult}
          />
        )}

        {screenState === 'RESULT' // status diferente pra cada número de acertos
          && <ResultWidget results={results} />}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/tilnoene/pokemonquiz" />
    </QuizBackground>
  );
}
