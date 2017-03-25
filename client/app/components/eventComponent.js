import React from 'react';

export default class HelloComponent extends React.Component {
  render() {
    return <span>Hello2</span>
  }
}

HelloComponent.displayName = 'HelloComponent';



// var module = angular.module('hang.directives', ['react']);

// const Test = (props) => (
//     <div>
//       <p>THIS IS A REACT COMPONENT</p>
//     </div>
//   );

// module.directive('testEvent', ['reactDirective', function(reactDirective) {
//   return reactDirective(Test);
// }]);


// class EventList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       users: []
//     }
//   }



//   render () {
//     return (
//       <ul>
//         {this.props.users.map(user =>
//           <li key=
//           )}
//       </ul>
//       )
//   }
// }