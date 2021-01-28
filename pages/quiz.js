import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import GitHubCorner from '../src/components/GitHubCorner';
import Button from '../src/components/Button';
import PokemonImage from '../src/components/PokemonImage';

function ResultWidget({ results }) {
  const acertos = results.filter((x) => x).length;

  return (
    <Widget>
      <Widget.Header>
        Resultado
      </Widget.Header>

      <Widget.Content>
        <p>{`Você acertou ${acertos} perguntas.`}</p>
        {acertos === 0 && <p>Tem certeza que você já assistiu ou jogou pokémon?</p>}
        {acertos === 1 && <p>Você pode ser considerado um trienador novato.</p>}
        {acertos === 2 && <p>Você é definitivamente um treinador pokémon!</p>}
        {acertos === 3 && <p>Você é a personificação da Pokédex, parabéns!</p>}

        <ul>
          {results.map((result, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>
              {`#${index + 1} Resultado: ${result ? 'Acertou' : 'Errou'}`}
            </li>
          ))}
        </ul>
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
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
        <h1>{question.title}</h1>
      </Widget.Header>
      <Widget.Content>
        <PokemonImage src={question.image} />
        <form onSubmit={(e) => {
          e.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            onSubmit();
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined);
          }, 2 * 1000);
        }}
        >
          {/* eslint-disable-next-line react/prop-types */}
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
              >
                <input
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          }) /* saber se tem selecionada e disabled no botão */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            CONFIRMAR
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
        </form>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage(props) {
  const [screenState, setScreenState] = useState(screenStates.RESULT);
  const [results, setResults] = useState([false, false, false]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const totalQuestions = 3; // props.questions.length;

  useEffect(() => {
    /* fetch() aqui */
  }, [questionIndex]);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Quem é esse pokémon?</title>
      </Head>

      <QuizContainer>
        <QuizLogo />
        {screenState === 'LOADING' && <LoadingWidget />}

        {screenState === 'QUIZ' && (
          <QuestionWidget
            question={props.questions[currentQuestion]}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
          />
        )}

        {screenState === 'RESULT' // status diferente pra cada número de acertos
          && <ResultWidget results={results} />}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/tilnoene/pokemonquiz" />
    </QuizBackground>
  );
}

function getRandomIntInclusive(min, max) {
  /* eslint-disable no-param-reassign */
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
export async function getStaticProps() {
  // try {
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

      const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonId}`)
        .then((response) => response.json());

      if (j === question.answer) {
        question.image = pokemon.sprites.other.dream_world.front_default;
      }
      question.alternatives.push(pokemon.name);
    }

    questions.push(question);
  }

  return {
    props: {
      questions: questions, // db.questions, se for usar o arquivo bd.json
    },
  };
  /* } catch (err) {
    throw new Error('Deu ruim:(');
  }
}
*/
