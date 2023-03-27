import React, { useState } from 'react'
import MovieDataService from "../services/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../style.css"

const AddReview = props => {

  let editing = false
  let initialReviewState = ""

  if(props.location.state && props.location.state.currentReview){
    editing = true
    initialReviewState = props.location.state.currentReview.review
  }


  const [review, setReview] = useState(initialReviewState)
  // keeps track if review is submitted
  const [submitted, setSubmitted] = useState(false)

  const onChangeReview = e => {
    const review = e.target.value
    setReview(review);
  } 
 
  const saveReview = () => {
    var data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: props.match.params.id // get movie id direct from url
    }

    if(editing){
        // get existing review id
        data.review_id = props.location.state.currentReview._id
        MovieDataService.updateReview(data)
          .then(response =>{
            setSubmitted(true);
            console.log(response.data)
          })
          .catch(e =>{
            console.log(e);
          })
      }
      else{
        MovieDataService.createReview(data)
          .then(response => {
            setSubmitted(true)
            console.log(response.data)
          })
          .catch(e =>{
            console.log(e);
          })    
      }
    }

  return(
    <div>
      {submitted ? (
        <div>
          <h4 style={{color: "white"}}>Review submitted successfully</h4>
          <Link to={"/movies/"+props.match.params.id}>
            Back to Movie
          </Link> 
        </div>
      ):(
        <div className='login'>
        <Form className='form'>
          <Form.Group>
            <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
            <Form.Control 
              type="text" 
              required
              value={review} 
              onChange={onChangeReview}
            />
          </Form.Group> 
          <Button variant="primary" className='button' onClick={saveReview}>
            Submit
          </Button>
        </Form>  
        </div>  
      )}
      
    </div>
  )
}

export default AddReview;
