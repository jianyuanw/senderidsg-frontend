import './App.css';
import { useState } from 'react';

const URL = 'https://n7ewjhzwy6wlrkf7bu2d7hbpby0dqvfw.lambda-url.ap-southeast-1.on.aws/';

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const [passcode, setPasscode] = useState('');
  const [fromCount, setFromCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [fromError, setFromError] = useState(false);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validFrom()) {
      setFromError(true);
      return;
    }
    setFromError(false);
    setSending(true);
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smsFrom: from,
        smsTo: to,
        smsBody: content,
        luckyNumber: passcode,
      }),
    });
    setStatus(response.status === 200 ? 'success' : 'failed');
    const json = await response.json();
    setResponse(JSON.stringify(json, null, 2));
    setSending(false);
  }

  function handleChangeFrom(e) {
    const value = e.target.value;
    setFrom(value);
    setFromCount(value.length);
  }

  function handleChangeTo(e) {
    const value = e.target.value;
    if (!isNaN(value)) {
      setTo(value);
    }
  }

  function handleChangeContent(e) {
    const value = e.target.value;
    setContent(value);
    setContentCount(value.length);
  }

  function handleChangePasscode(e) {
    setPasscode(e.target.value);
  }

  function validFrom() {
    const regex = /[a-zA-Z]/;
    return regex.test(from);
  }

  return (
    <main className="container-fluid">
      <form onSubmit={handleSubmit}>
        <h1 className="text-center mt-4">Send SMS</h1>
        <p className="text-center">- For Sender ID testing -</p>
        <div>
          <label htmlFor="from" className="form-label">From</label>
          <input
            type="text"
            className="form-control"
            id="from"
            placeholder="Alphanumeric, at least 1 alphabet"
            value={from}
            onChange={handleChangeFrom}
            maxLength={11}
            required
          />
          <div className="text-end small">{fromCount}/11 characters</div>
          { fromError && <div className="text-end small text-danger">At least one alphabet is required</div> }
        </div>
        <div className="mb-3">
          <label htmlFor="to" className="form-label">To</label>
          <input
            type="text"
            className="form-control"
            id="to"
            placeholder="SG mobile number"
            value={to}
            onChange={handleChangeTo}
            maxLength={8}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="form-label">SMS Content</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            placeholder="Your SMS content"
            value={content}
            onChange={handleChangeContent}
            maxLength={160}
            required
          ></textarea>
          <div className="text-end small">{contentCount}/160 characters</div>
        </div>
        <div className="mb-4">
          <label htmlFor="passcode" className="form-label">Passcode</label>
          <input
            type="text"
            className="form-control"
            id="passcode"
            value={passcode}
            onChange={handleChangePasscode}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-secondary w-100"
          disabled={sending}
        >
          {sending ? 'SENDING...' : 'SEND' }
        </button>
      </form>
      { status === 'success' && <p className="mt-3 text-warning">SMS sent successfully!</p> }
      { status === 'failed' && <p className="mt-3 text-danger">SMS failed to send!</p> }
      { response && <p>Response:</p> }
      { response && <pre>{response}</pre> }
    </main>
  );
}

export default App;
