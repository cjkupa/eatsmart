import React from 'react';
import EatSmart from './EatSmart';
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  componentDidCatch(error) { this.setState({ error: error.message }); }
  render() {
    if (this.state.error) return React.createElement('div', {style:{padding:20,color:'red',fontFamily:'monospace'}}, 'Error: ' + this.state.error);
    return this.props.children;
  }
}
export default function App() { return React.createElement(ErrorBoundary, null, React.createElement(EatSmart)); }