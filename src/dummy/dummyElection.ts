
import { Election } from "../shared/models";

export const election: Election = {
  id: "1",
  type: "election",
  name: "NPS Elections",
  caption: "Choose Responsibly, Choose Responsibility.",
  image: "../../client/assets/images/election-default.jpg",
  color: "black",
  polls: [{
    id: "2",
    type: "poll",
    name: "Prefect",
    caption : "Reach Out, Reach High, Reach Beyond.",
    color: "red",
    parentID: "1",
    group: "",
    candidates: [{
      id: "3",
      type: "candidate",
      name: "Superman",
      image: "../../client/assets/images/election-default.jpg",
      votes: 1000,
      parentID: "2",
      fallback: "2",
      fallbackName: "Prefect"
    }]
  }]
};
