import Header      from "../../components/Header/Header";
import KittensSection from "../../components/KittensSection/KittensSection";
import { useTranslation } from "react-i18next";
import CatsForSale from "../../components/CatsForSale/CatsForSale";

export default function Kittens() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <KittensSection />
      <section>
      <CatsForSale categoryFilter="кошенята" />
      </section>
    </>
  );
}
