import React, { useEffect, useState } from "react";
import { image } from './Config';
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function Points(){
    const [img,setImg] =useState('')
    const [imgUrl,setImgUrl] =useState([])

    const handleClick = () =>{
     if(img !==null){
        const imgRef =  ref(image,`files/${v4()}`)
        uploadBytes(imgRef,img).then(value=>{
            console.log(value)
            getDownloadURL(value.ref).then(url=>{
                setImgUrl(data=>[...data,url])
            })
        })
     }
    }

    useEffect(()=>{
        listAll(ref(image,"files")).then(imgs=>{
            console.log(imgs)
            imgs.items.forEach(val=>{
                getDownloadURL(val).then(url=>{
                    setImgUrl(data=>[...data,url])
                })
            })
        })
    },[])


    return(
        <div className="App">
                <input type="file" onChange={(e)=>setImg(e.target.files[0])} /> 
                <button onClick={handleClick}>Upload</button>
                <br/>
                {
                    imgUrl.map(dataVal=><div>
                        <img src={dataVal} height="200px" width="200px" />
                        <br/> 
                    </div>)
                }
        </div>
    )
}
export default Points;