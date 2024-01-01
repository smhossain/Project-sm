import { useState, useEffect } from "react"
import { addQuery, reset } from "../features/query/querySlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"

// A form uesd in /queries page for submitting new query
// used in /admin/manage-queries as well
function NewQuery() {
    const { isLoading, isError, isSuccess, message} = useSelector((state) => state.query)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [question, setQuestion] = useState('')
    const [tags, setTags] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            dispatch(reset())
            navigate('/')
        }
    }, [dispatch, isError, isSuccess, navigate, message])
    
    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(addQuery({name, email, question, tags}))
    }

    if (isLoading) {
        return <Spinner />
    }
  return (
    <>
        <h1>Submit your own query</h1>
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" value={email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" value={name} placeholder="Your name" onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">Enter you query</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={question} onChange={(e) => setQuestion(e.target.value)}></textarea>
        </div>
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value={tags} onChange={(e) => setTags(e.target.value)}/>
            <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
        </div>
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value={tags} onChange={(e) => setTags(e.target.value)}/>
            <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
        </div>
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value={tags} onChange={(e) => setTags(e.target.value)}/>
            <label className="form-check-label" htmlFor="inlineCheckbox3">3</label>
        </div>
        <div className="form-group">
            <button type="submit" className="btn btn-primary mb-2">Submit Query</button>
        </div>
        </form>
    </>
  )
}

export default NewQuery