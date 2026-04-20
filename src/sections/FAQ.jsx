import { useTranslation } from "react-i18next";
import FAQList from "../components/FAQList";

const FAQ = () => {
  const { t } = useTranslation();

  return (
    <section id="FAQ">
      <h2>{t("faq.title")}</h2>
      <FAQList />
    </section>
  );
};

export default FAQ;
