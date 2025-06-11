import Header      from "../../components/Header/Header";
import KittensSection from "../../components/KittensSection/KittensSection";
import { useTranslation } from "react-i18next";
import CatsForSale from "../../components/CatsForSale/CatsForSale";
import ScrollDownButton from "../../components/ScrollDownButton/ScrollDownButton";

export default function Kittens() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <KittensSection />
      
      {/* glassmorphism scroll button */}
      <ScrollDownButton targetId="kittens-list" />
      
      <section id="kittens-list">
        <CatsForSale categoryFilter="КОШЕНЯТА" showSearchInput={false} />
      </section>
    </>
  );
}
