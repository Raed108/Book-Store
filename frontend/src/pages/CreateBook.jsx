/* eslint-disable no-unused-vars */
import React,{useState} from 'react'
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export const CreateBook = () => {
  const [title,setTitle] = useState('');
  const [author,setAuthor] = useState('');
  const [publishYear,setPublishYear] = useState('');
  const [description,setDescription] = useState('');
  const [loading,setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    author: yup.string().required("Author is required"),
    publishYear: yup
        .number()
        .typeError("Publish year must be a number")  
        .required("Publish year is required")
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
});

const onSubmit = data => {
    console.log(data);
};

  const handleSaveBook = () => {
    const data ={
      title,
      author,
      publishYear,
      description
    }
    setLoading(true);
    if(isGenerated){
      axios.post('http://localhost:8000/books/oneBook',data).then((res)=>{
        setLoading(false);
        enqueueSnackbar('Book Created Successfully',{variant:'success'});
        navigate('/');
      }).catch((err)=>{
        setLoading(false);
        enqueueSnackbar('Failed to create book',{variant:'error'});
        console.log(err); 
    })
    }
    else{
      axios.post('http://localhost:8000/books',data).then((res)=>{
        setLoading(false);
        enqueueSnackbar('Book Created Successfully',{variant:'success'});
        navigate('/');
      }).catch((err)=>{
        setLoading(false);
        enqueueSnackbar('Failed to create book',{variant:'error'});
        console.log(err); 
    })
    }
    
}
  return (
    <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
      {loading ? <Spinner /> : ""}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto bg-white'>
        <div className='my-4'>  
          <label className='text-xl mr-4 text-gray-500'>Title <span className='text-red-500'>*</span>
          </label>
          <input type='text' value={title} {...register("title")} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setTitle(e.target.value)}/>
          {errors.title && <p style={{color: "red"}}>{errors.title.message}</p>}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author <span className='text-red-500'>*</span>
          </label>
          <input type='text' value={author} {...register("author")} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setAuthor(e.target.value)}/>
          {errors.author && <p style={{color: "red"}}>{errors.author.message}</p>}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year <span className='text-red-500'>*</span>
          </label>
          <input type='number' value={publishYear} {...register("publishYear")} className='border-2 border-gry-500 px-4 py-2 w-full rounded-xl' onChange={(e)=>setPublishYear(e.target.value)}/>
          {errors.publishYear && <p style={{color: "red"}}>{errors.publishYear.message}</p>}
        </div>
        <div className="my-4">
        <label className="text-xl mr-4 text-gray-500">Description</label>
        <textarea 
            value={description} 
            className="border-2 border-gry-500 px-4 py-2 w-full rounded-xl" 
            rows="4" 
            onChange={(e) => setDescription(e.target.value)} 
            disabled={isGenerated}>
          </textarea>
        <div className="flex items-center mt-2">
          <input 
            type="checkbox" 
            name="generate" 
            id="generate" 
            className="mr-2" 
            onChange={(e) => setIsGenerated(e.target.checked)}
          />
          <label htmlFor="generate" className="text-gray-500 text-xl">
            Generate Description
          </label>
        </div>
      </div>
          <button className='p-2 bg-sky-300 m-8 rounded-xl hover:bg-sky-400 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out' onClick={handleSaveBook}>Create</button>
      </div>
    </form>
  )
}

export default CreateBook;