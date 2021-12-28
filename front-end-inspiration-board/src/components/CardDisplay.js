import React from "react";
import Card from "./Card";

const CardDisplay = (props) => {
  const cardComponents = [];
  if (props.cardList) {
    for (let card of props.cardList) {
      cardComponents.push(<Card cardMessage={card.message} />);
    }
  }

  return (
    <section className="card-display-block grid-block">
      <h1>{props.currentBoard}</h1>
      {console.log(props.currentBoard)}
      {cardComponents}
    </section>
  );
};

export default CardDisplay;
