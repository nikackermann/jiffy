import React, { Component } from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {/* if we have results show clear button otherwise show logo */}
    {hasResults ? (
      <button>
        <img src={clearButton} onClick={clearSearch} alt={''} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? (
      <img className="block mx-auto" src={loader} alt={hintText} />
    ) : (
      hintText
    )}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: '',
      loading: false,
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({
      // set loading state to be true
      loading: true
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=daPo07a50rmt8xiqnvXVn1rh0nFL1RS6&q=
        ${searchTerm}
        &limit=25&offset=0&rating=R&lang=en`
      );
      // grabs the results data from our json code
      const { data } = await response.json(); // same as saying data.data

      // check if array results is empty
      // if it is throw a catch error

      if (!data.length) {
        // !data.length mean no data in array
        throw `Nothing found for ${searchTerm}`;
      }

      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState, // unpacking state
        // take previous gifs and spread out in array then
        // add new gif to the array.
        gifs: [...prevState.gifs, randomGif],
        // change hint text
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        loading: false,
        hintText: error // throw passes string data to catch
      }));
    }
  };

  // write our methods as arrow function so
  // constructor or bind we don't need
  handleChange = event => {
    const { value } = event.target;
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      // and we then overwrite the ones we want after
      searchTerm: value,
      // set hint text only when text length > 2 otherwise
      // display an empty string on the page
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const { value } = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      event.preventDefault();
      this.searchGiphy(value);
    }
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    // grab input and refocus on input
    this.textInput.focus();
  };

  render() {
    // const searchTerm = this.state.searchTerm;
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {this.state.gifs.map((gif, i) => <Gif key={i} {...gif} />)}
          <input
            className="input grid-item"
            placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        {/* pass state using spread operator */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
