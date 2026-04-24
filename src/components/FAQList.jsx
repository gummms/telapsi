import React from "react";
import T from "./T";
import FAQItem from "./FAQItem";
import "./FAQList.css";

const FAQList = () => {
  const allFAQs = [
    {
      id: 1,
      question: "Posso assistir aos filmes?",
      answer: "Por questões de direitos autorais, o Telapsi não é capaz de armazenar ou reproduzir trechos ou filmes completos.",
    },
    {
      id: 2,
      question: "O acesso é gratuito?",
      answer: "O Telapsi é um projeto acadêmico e, portanto, não tem fins lucrativos. O acesso e o uso da plataforma são totalmente gratuitos.",
    },
    {
      id: 3,
      question: "Posso exportar PDF ou PPTX?",
      answer: "É possível exportar um guia didático ou uma ficha de filme em PDF, mas não em PPTX.",
    },
    {
      id: 4,
      question: "Como meus dados são utilizados?",
      answer: "O Telapsi armazena apenas o seu endereço de e-mail para propósitos de autenticação. Nenhum outro dado é coletado.",
    },
  ];

  return (
    <div className="FAQ-container">
      {allFAQs.map((item) => (
        <FAQItem
          key={item.id}
          question={<T>{item.question}</T>}
          answer={<T>{item.answer}</T>}
        />
      ))}
    </div>
  );
};

export default FAQList;
