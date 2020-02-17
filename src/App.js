import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css'

//redux imports
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux'


//map

const mapStateToProps = (state) => {
  return {  
    //data of each track
      trackList: state,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createTracks: (searchResult) => {
      return dispatch(createTracks(searchResult))
    }
  }

}
//action -- searchItunes with the keyword searchTerm
function createTracks(searchResult) {
  return {
    type: 'CREATE',
    searchResult: searchResult
  };
}


//reducer that gets the input from axios response and updates trankList with appropriate data
function createTracksReducer(state = [{trackViewUrl: '',trackName: '',artworkUrl100: '',previewUrl: ''}],
 action) {
  if(action.type === 'CREATE') {
    state = action.searchResult
  }
  return state;

}


class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      search: '',
      searchResult: [],
      trackList: [{trackViewUrl: '',trackName: '',artworkUrl100: '',previewUrl: ''}],
      displaySearchRes: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
    this.resetVisibility = this.resetVisibility.bind(this);

  }
  handleChange(e){
    this.setState({
      search: e.target.value
    });
  }

  submitHandle(){

    //axios get request with search query and parameter term == searchTerm
    axios.get('https://itunes.apple.com/search',{
          params: {
            term: `${this.state.search}`
          }
    })
    .then(response => {
      //once the asynchronous axios request returns a response
      if(response.data.results.length === 0) {
        //if no results set searchResults to null
        console.error("No results for this search term");
        this.setState({
          //set searchResults == null
        })
      }
      else{
        //got some results
        this.setState({
          //update state with results
          searchResult :  response.data.results
        }); 
        
        //dispatch action with searchResult
        //createTracks 
        this.props.createTracks(this.state.searchResult);
        
        //toggle visiblity of results
        this.setState({
          displaySearchRes: true
        });
      }
    }).catch(err => console.error(err));

  }

resetVisibility(){
  this.setState({
    search: '',
    displaySearchRes: false
  });
}
  
  render(){
    return (
      <div className="container container-fluid">
        <div className="text-center">
          <button  onClick={this.resetVisibility}>Search Artists on itunes</button>
          <div >
          <div >
            <input className="form-group" value={this.state.search} onChange={this.handleChange}/>
       
          </div>
          <div >
            <button className="btn btn-primary" type="submit" onClick={this.submitHandle}>search</button>
          </div>
        </div>
        {this.state.displaySearchRes && 
        <div>
          <h3>Search results for {this.state.search}</h3>
        <div className="flex-container">
          {this.props.trackList.map(track => {
            return(
            
              <div className="track">
                      <a href={track.trackViewUrl} target="blank">
                        <div className="trackArt">
                           <img src={track.artworkUrl100} alt="" />
                        </div>
                        <div className="track-name">
                          {track.trackName}
                        </div>
                      </a>
                      <div className="playTrack">
                        <audio controls preload="none">
                          <source src={track.previewUrl} type="audio/mpeg"/>
                        </audio>
                      </div>
                    </div>
                    
                    )})}
                    </div> 
                    </div>
                    }
                    </div> }
      </div>
    )
  }
}
//redux store intiated with searchReducer
const store = createStore(createTracksReducer);
//container that connects redux store to the react app

const Container  = connect(mapStateToProps, mapDispatchToProps)(App);

//redux appWrapper that renders the app as a child of redux components
class AppWrapper extends React.Component {

    constructor(props){
      super(props);
      this.state = {

      }
}  
render(){
    return(
      <Provider store={store}>
        <Container />
      </Provider>  
    )
  }

}

export default AppWrapper;