class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }
  }



  render () {
    return (
      <ul>
        {this.props.users.map(user =>
          <li key=
          )}
      </ul>
      )
  }
}