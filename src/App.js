import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const generateQueryString = (params) => {
    return new URLSearchParams(params).toString();
  };

  return (
    <div className="centered">
      <h1>Mandate Stub</h1>
      <div className="button-container">
        <Link to={`/success?${generateQueryString(params)}`} className="button1">Success</Link>
        <div className="button-gap" />
        <Link to={`/failure?${generateQueryString(params)}`} className="button2">Failure</Link>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [Id, setId] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = 'https://apim.quickwork.co/UATStaging/DMIAPP/v2/stub';
    const apiKey = 'RNP5g9vKT9ffhdS06XTqaqvR5MIB22gO';

    // Convert searchParams to an object
    const requestBody = Object.fromEntries([...searchParams]);

    const postData = async () => {
      try {
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'apiKey': apiKey
          }
        });

        console.log('Success:', response.data);
        setId(response.data.Id);
        setStatusCode(response.data.status_code);

        if (response.data.status_code === "400") {
          navigate('/failure');
          return;
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    postData();
  }, [navigate, searchParams]);

  return (
    <>
      <h2 style={{ marginLeft: 20 }}>Success Page</h2>
      {isLoading ? (
        <div style={{ marginLeft: 20 }}>Loading...</div>
      ) : (
        <div>
          <div style={{ marginLeft: 20 }}>Id: {Id}</div>
          <div style={{ marginLeft: 20 }}>Status Code: {statusCode}</div>
        </div>
      )}
    </>
  );
};

const FailurePage = () => {
  return <h2 style={{ marginLeft: 20 }}>Failure</h2>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
      </Routes>
    </Router>
  );
};

export default App;