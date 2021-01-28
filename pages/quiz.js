import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import PokemonImage from '../src/components/PokemonImage';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
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
  const questionId = `question__${questionIndex}`;

  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
        <h1>{question.title}</h1>
      </Widget.Header>
      <Widget.Content>
        <PokemonImage src={question.image} />
        <form onSubimt={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          {/* eslint-disable-next-line react/prop-types */}
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;

            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
              >
                <input
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          }) /* saber se tem selecionada e disabled no botão */}
          <Button>CONFIRMAR</Button>
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
  const [screenState, setScreenState] = useState(screenStates.QUIZ);
  const totalQuestions = 5;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;

  useEffect(() => {
    /* fetch() aqui */
    setTimeout(() => {

    }, 1 * 1000);
  }, [questionIndex]);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.FINISH);
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
            question={props.question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
          />
        )}

        {screenState === 'RESULT' && <div>Você acertou N questões</div>}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/tilnoene/pokemonquiz" />
    </QuizBackground>
  );
}

export async function getStaticProps() {
  // try {
  const question = {};
  const PokemonId = [];

  question.title = 'Quem é esse pokémon?';
  question.answer = getRandomIntInclusive(0, 3);
  question.alternatives = [];

  for (let i = 0; i < 5; i += 1) {
    let newPokemonId = getRandomIntInclusive(1, 386);

    // não repetir o nome do pokémon
    while (PokemonId.indexOf(newPokemonId) !== -1) {
      newPokemonId = getRandomIntInclusive(1, 386);
    }
    PokemonId.push(newPokemonId);

    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonId}`)
      .then((response) => response.json());

    if (i === question.answer) {
      question.image = pokemon.sprites.other.dream_world.front_default;
    }
    question.alternatives.push(pokemon.name);
  }

  return {
    props: {
      question,
    },
  };
  /* } catch (err) {
    throw new Error('Deu ruim:(');
  } */
}
