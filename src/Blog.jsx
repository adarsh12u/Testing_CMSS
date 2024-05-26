import React, { useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWbm_NXKbmTrkbq5T9DUgeVTxS-w5P4gA",
  authDomain: "cmsss-8b6de.firebaseapp.com",
  projectId: "cmsss-8b6de",
  storageBucket: "cmsss-8b6de.appspot.com",
  messagingSenderId: "716741118558",
  appId: "1:716741118558:web:27ee416b1c286a446042cf",
  measurementId: "G-VN86FX1V8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const image = getStorage(app)

const DynamicDataForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    points: {},
    previewImage: null,
    tags: [],
    newPointKey: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "tags" ? value.split(",") : value
    }));
  };

  const handlePreviewImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      previewImage: file
    }));
  };

  const handlePointImageChange = (e, pointKey) => {
    const file = e.target.files[0];
    if (file) {
       const imageRef = ref(image,`point_images/${pointKey}/${file.name}`);
      uploadBytes(imageRef,file).then((snapshot) => {
        console.log(snapshot)
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url)
          setFormData((prevData) => ({
            ...prevData,
            points: {
              ...prevData.points,
              [pointKey]: {
                ...prevData.points[pointKey],
                image: url
              }
            }
          }));
        });
      });
    }
  };

  const handlePointChange = (e, pointKey, subKey) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      points: {
        ...prevData.points,
        [pointKey]: {
          ...prevData.points[pointKey],
          [subKey]: value
        }
      }
    }));
  };

  const addPoint = () => {
    const newPointKey = formData.newPointKey.trim();
    if (newPointKey) {
      setFormData((prevData) => ({
        ...prevData,
        points: {
          ...prevData.points,
          [newPointKey]: { text: '', image: '' }
        },
        newPointKey: ''
      }));
    }
  };

  const removePoint = (pointKey) => {
    const { [pointKey]: deletedPoint, ...remainingPoints } = formData.points;
    setFormData((prevData) => ({
      ...prevData,
      points: remainingPoints
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('previewImage', formData.previewImage);
    formDataToSend.append('tags', Array.isArray(formData.tags) ? formData.tags.join(',') : '');
    formDataToSend.append('points',JSON.stringify(formData.points))
    


    try {
      // Send formDataToSend to your backend
      const response = await fetch('https://cms-for-course-and-authentification.vercel.app/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2NTA5NGFmM2Y5ZDNiNjk2YjY3Njc0NiIsIm5hbWUiOiJBREFSU0ggR1VSSkFSIiwiZW1haWwiOiJhZGFyc2hAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ1ludThUQklmcXFETzdOcDEwNHk5dXNMaktvbWdYbWNRZHlaOWhDTDd1cGY3ZksvQURhdjYiLCJhdXRob3JpemF0aW9uIjp0cnVlLCJfX3YiOjB9LCJpYXQiOjE3MTY2MzQxOTJ9.qdoSLqotYRB1MG2LyoQE0FUCwfIAkCAGDLvBqLc2NeU'}`,
        },
        body: formDataToSend
      });
  
      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      // Handle successful response
      console.log('Form submitted successfully!');
      // Reset form state if needed
    } catch (error) {
      // Handle errors
      console.error('Error submitting form:', error.message);
    }

  };
  return (
    <div>
      <h2>Dynamic Data Form</h2>
      <form  onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Preview Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePreviewImageChange}
          />
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(',') : ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>New Point Key:</label>
          <input
            type="text"
            name="newPointKey"
            value={formData.newPointKey}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Points:</label>
          {Object.entries(formData.points).map(([pointKey, point]) => (
            <div key={pointKey}>
              <input
                type="text"
                value={point.text}
                placeholder="Text"
                onChange={(e) => handlePointChange(e, pointKey, 'text')}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePointImageChange(e, pointKey)}
              />
              <button type="button" onClick={() => removePoint(pointKey)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addPoint}>
            Add Point
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicDataForm;
