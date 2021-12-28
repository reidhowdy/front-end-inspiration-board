import "./App.css";
import Boardz from "./components/Boardz";
import CardDisplay from "./components/CardDisplay";
import NewCardForm from "./components/NewCardForm";
import NewBoardForm from "./components/NewBoardForm";
import { useState } from "react";
import React, { useEffect } from "react";
import axios from "axios";

function App() {
  const boardURL = "https://winspo-board.herokuapp.com/board";

  // This is a piece of state. It's a list of all the board objects in our api database
  const [boardList, setBoardList] = useState([]);

  // This is a piece of state. It's a list of all card objects for a specific board.
  const [cardList, setCardList] = useState([]);

  // This function POSTs the data in form to ther heroku database. and updates the state boardList
  const addNewBoard = (newBoard) => {
    axios
      .post(boardURL, newBoard)
      .then((response) => {
        console.log("a new board has been posted");
        // console.log(response.data);
        const boards = [...boardList];
        boards.push(response.data);
        setBoardList(boards);
      })
      .catch((err) => console.log(err));
  };
  // This piece of state represents the currently selected board -vange
  const [currentBoard, setCurrentBoard] = useState();

  //This function POSTs a new card and its message to our db. Also updates the state cardList
  //It updates state so that the new card immediately displays.
  const addNewCard = (newCard) => {
    if (currentBoard) {
      console.log(currentBoard);
      axios
        .post(`${boardURL}/${currentBoard}`, newCard)
        .then((response) => {
          console.log("a new card has been posted");
          console.log(response.data);
          const cards = [...cardList];
          cardList.push(response.data);
          setCardList(cards);
        })
        .catch((err) => console.log(err));
    }
  };

  // GET all the boards
  useEffect(() => {
    axios
      .get("https://winspo-board.herokuapp.com/board")
      .then((response) => {
        setBoardList([...response.data]);
      })
      .catch((err) => console.log(err));
  }, []);

  ///////////////

  // This function should update the currentBoard state. It is invoked when a user clicks on a board. It should be passed as a prop to Boardz.js, then down to Board.js
  // const updateCurrentBoard = (id) => {
  const updateCurrentBoard = (boardInfo) => {
    setCurrentBoard(boardInfo.title);
    axios
      .get(`https://winspo-board.herokuapp.com/board/${currentBoard}/cards`)
      .then((response) => {
        setCardList([...response.data]);
      })
      .catch((err) => console.log(err));

    console.log(`the board has been updated to ${boardInfo.id}`);
    // call function to get cards associated with current board
  };

  // This function takes in a list of board objects. Iterates over each object, makes a <Board /> and gives it an object {name:'', owner: ''} and updateCurrentBoard() function as props
  const createBoardMenu = (boardList) => {};

  //This function makes a DELETE http request. It deletes one board by id
  const deleteABoard = (id) => {
    axios
      .delete(boardURL + `/${id}`)
      .then((response) => {
        console.log(response.data);
        // setBoardList([...response.data]);
      })
      .catch((err) => console.log(err));
  };

  //This function iterates thru boardList and deletes every object from the herouku database by calling deleteABoard(). It is passed to Boarz as a prop and invoked in Boardz when a user clicks on the 'clear all boards' button.
  const deleteAllBoards = () => {
    boardList.forEach((element) => {
      deleteABoard(element.id);
    });
  };
  return (
    <section>
      <header></header>
      <div className="grid-layout-container">
        <section className="site-title-block grid-block">
          <p className="site-title">InspoBoard</p>
        </section>
        <Boardz
          updateCurrentBoardCallback={updateCurrentBoard}
          deleteAllBoardsCallback={deleteAllBoards}
          boardList={boardList}
        />
        <NewCardForm addNewCardCallback={addNewCard} />
        <NewBoardForm addNewBoardCallback={addNewBoard} />
        <CardDisplay cardList={cardList} currentBoard={currentBoard}/>
      </div>
    </section>
  );
}

export default App;
