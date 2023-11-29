import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  loadGraph: boolean
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      loadGraph: false // add this boolean to ensure state has data before rendering graph
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if(this.state.loadGraph) {
      return (<Graph data={this.state.data}/>)
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    // Ensure we can destroy the unique interval keys after certain iterations
    // to avoid memory leaks / unexpected behaviours
    // Define the limit number of attempts to fetch data
    const limit = 1000;
    let cycleAttempts = 0;


    // Continually call server after every 1 sec after button clicked
    const intervalKey = setInterval(() => {
      // Fetch data from the server
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState(
          { 
            data: [...this.state.data, ...serverResponds], 
            loadGraph: true // Indicate that the graph should be shown
          });

        // Increment the number of attempts
        cycleAttempts++;

        // counts the number of iterations and clears interval instances created previously 999 times
        // to free memory
        if(cycleAttempts >= limit){
            clearInterval(intervalKey);
        }
      });
    },1000); // reload after every 1 sec

  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
