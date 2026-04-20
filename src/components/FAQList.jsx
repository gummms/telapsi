import React from "react";
import { useTranslation } from "react-i18next";
import FAQItem from "./FAQItem";
import "./FAQList.css";

const FAQList = () => {
  const { t } = useTranslation();

  const allFAQs = [
    {
      id: 1,
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      id: 2,
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      id: 3,
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      id: 4,
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
  ];

  return (
    <div className="FAQ-container">
      {allFAQs.map((item) => (
        <FAQItem key={item.id} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQList;
