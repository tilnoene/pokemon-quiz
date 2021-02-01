/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizPage from './index';

export default function QuizDaGaleraPage(props) {
  return (
    <ThemeProvider theme={props.externalDb.theme}>
      <QuizPage dataBase={props.externalDb} />
    </ThemeProvider>
  );
}

// eslint-disable-next-line consistent-return
export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');

  try {
    const externalDb = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((data) => data);

    return {
      props: {
        externalDb,
      },
    };
  } catch (err) {
    window.location.href(`https://${projectName}.${githubUser}.vercel.app`);
  }
}
