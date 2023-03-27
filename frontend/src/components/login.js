import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { generateObjectIdFromString } from '../utils'
import "../style.css"
 
const Login = props => {
  
  const [name, setName] = useState("")
  const [id, setId] = useState("")  

  const onChangeName = e => {
    const name = e.target.value
    setName(name);
  }  

  const onChangeId = e => {
    const id = e.target.value
    setId(id);
  }  

  const login = () => {
    const validUserId = generateObjectIdFromString(id);
    props.login({ name: name, id: validUserId });
    props.history.push("/");
  };
  

  return(
      <div className='login'>
      <Form className='form'>
        <Form.Group>
          <Form.Control 
            type="text" 
            placeholder="Enter username" 
            value={name} 
            onChange={onChangeName}
          />
        </Form.Group> <br />
        <Form.Group>
          <Form.Control 
            type="text" 
            placeholder="Enter id" 
            value={id} 
            onChange={onChangeId}
          />
        </Form.Group> <br />       
        <Button variant="primary" className='button' onClick={login}>
          Submit
        </Button>
      </Form>  
    </div>  
  )
}

export default Login;
