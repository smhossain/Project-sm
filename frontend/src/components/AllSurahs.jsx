import {  useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { getAllSurahs, resetGet } from '../features/surah/surahSlice'
import Spinner from '../components/Spinner'
import SurahItem from '../components/SurahItem'


function AllSurahs() {

    const {surahs, isError, isLoading, isSuccessGet, message} = useSelector((state) => state.surah)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSurahs())
        if (isError) {
            toast.error(message)
        }
    }, [dispatch, isError, message])

    useEffect(() => {
        return () => {
            if (isSuccessGet) {
                dispatch(resetGet())
            }
        }
    }, [dispatch, isSuccessGet])

    if (isLoading) {
        return <Spinner />
    }

  return (
    <div className="container-fluid">
    <h1>All Surahs</h1>
    {surahs.length === 0 ? 
        <p>There are no Surahs to show</p> : 
        surahs.map((surah) => (
            <SurahItem key={surah._id} surah={surah} />
        ))}
    </div>
  )
}

export default AllSurahs