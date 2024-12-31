/* eslint-disable no-unused-vars */
import React,{useState , useEffect} from 'react'
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const EditBook = () => {
  const [title,setTitle] = useState('');
  const [author,setAuthor] = useState('');
  const [publishYear,setPublishYear] = useState('');
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const { id } = useParams();
  useEffect(()=>{
    setLoading(true);
    axios.get(`http://localhost:8000/books/${id}`).then((res)=>{
      setTitle(res.data.title);
      setAuthor(res.data.author);
      setPublishYear(res.data.publishYear);
      setLoading(false);
    }).catch((err)=>{
      console.log(err);
      setLoading(false);
    })
  },[])
  const handleEditBook = () => {
    const data ={
      title,
      author,
      publishYear,
    }
    setLoading(true);
    axios.put(`http://localhost:8000/books/${id}`,data).then((res)=>{
      setLoading(false);
      enqueueSnackbar('Book Updated Successfully',{variant:'success'});
      navigate('/');
    }).catch((err)=>{
      setLoading(false);
      enqueueSnackbar('Failed to update book',{variant:'error'});
      console.log(err); 
  })
}
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>
      {loading ? <Spinner /> : ""}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto bg-white'>
        <div className='my-4'>  
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input type='text' value={title} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setTitle(e.target.value)}/>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input type='text' value={author} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setAuthor(e.target.value)}/>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input type='text' value={publishYear} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setPublishYear(e.target.value)}/>
        </div>
        {/* <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <textarea className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' rows='4'></textarea>
        </div>   */}
          <button className='p-2 bg-sky-300 m-8 rounded-xl hover:bg-sky-400 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' onClick={handleEditBook}>Save</button>
      </div>
    </div>
  )
}

export default EditBook;