import axios from "axios";
import Card from "../components/Card/Card";

// Define action types as constants
const DATA_REQUEST = "DATA_REQUEST";
const DATA_SUCCESS = "DATA_SUCCESS";
const DATA_FAILURE = "DATA_FAILURE";
const SELECT_DATA_REQUEST = "SELECT_DATA_REQUEST";
const SELECT_DATA_SUCCESS = "SELECT_DATA_SUCCESS";
const SELECT_DATA_FAILURE = "SELECT_DATA_FAILURE";

// Fetch all data
export const fetchAllData = () => async (dispatch) => {
  try {
    dispatch({ type: DATA_REQUEST });
    const response = await axios.get(
      "https://api.quicksell.co/v1/internal/frontend-assignment/"
    );
    dispatch({ type: DATA_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: DATA_FAILURE, error });
  }
};

// Select and filter data by group
export const selectData = (group, allTickets, orderValue) => async (dispatch) => {
  try {
    dispatch({ type: SELECT_DATA_REQUEST });

    let userMode = false;
    const setForFilter = new Set();
    let dataArray = [],
      selectedData = [];

    if (group === "status") {
      allTickets.forEach((ticket) => setForFilter.add(ticket.status));
      dataArray = [...setForFilter];
      dataArray.forEach((status, index) => {
        const filtered = allTickets.filter((ticket) => ticket.status === status);
        selectedData.push({
          [index]: {
            title: status,
            value: filtered,
          },
        });
      });
    } else if (group === "user") {
      userMode = true;
      allTickets?.allUser?.forEach((user, index) => {
        const userTickets = allTickets?.allTickets?.filter(
          (ticket) => ticket.userId === user.id
        );
        selectedData.push({
          [index]: {
            title: user.name,
            value: userTickets,
          },
        });
      });
    } else {
      const priorityList = ["No priority", "Urgent", "High", "Medium", "Low"];
      priorityList.forEach((priority, index) => {
        const filteredByPriority = allTickets.filter(
          (ticket) => ticket.priority === index
        );
        selectedData.push({
          [index]: {
            title: priority,
            value: filteredByPriority,
          },
        });
      });
    }

    // Sorting by title or priority if specified
    if (orderValue === "title") {
      selectedData.forEach((group, index) => {
        group[index]?.value?.sort((a, b) => a.title.localeCompare(b.title));
      });
    } else if (orderValue === "priority") {
      selectedData.forEach((group, index) => {
        group[index]?.value?.sort((a, b) => b.priority - a.priority);
      });
    }

    dispatch({
      type: SELECT_DATA_SUCCESS,
      payload: { selectedData, user: userMode },
    });
  } catch (error) {
    dispatch({
      type: SELECT_DATA_FAILURE,
      payload: error.message,
    });
  }
};
