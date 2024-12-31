/* eslint-disable no-unused-vars */
import React,{useState} from 'react'
import BackButton from '../components/BackButton';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate,useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const DeleteBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const handleDeleteBook = () => {
    setLoading(true);
    axios.delete(`http://localhost:8000/books/${id}`).then((res)=>{
      setLoading(false);
      enqueueSnackbar('Book Deleted Successfully',{variant:'success'});
      navigate('/');
    }).catch((err)=>{
      enqueueSnackbar('Failed to delete book',{variant:'error'});
      console.log(err);
      setLoading(false);
    })
  }
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading ? <Spinner /> : ""}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure to delete this book?</h3>
        <button className='p-4 bg-red-600 m-8 rounded-xl hover:bg-red-700 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' onClick={handleDeleteBook}>Yes, Delete It</button>
      </div>
    </div>
  )
}

export default DeleteBook;