import React, { useEffect, useState } from "react";
import axios from "axios";

const MfaSetup = () => {
  const [qrCode, setQrCode] = useState(null);
  const [otpUri, setOtpUri] = useState(null);
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get("/auth/enable_mfa/", {
          withCredentials: true,
        });

        setQrCode(response.data.qr_code_base64);
        setOtpUri(response.data.otp_uri);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || "Something went wrong");
        } else {
          setError("Server error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQrCode();
  }, []);

  const handleConfirmOtp = async () => {
    console.log("Confirming OTP:", otpToken);
    try {
      const response = await axios.post(
        "/auth/confirm_mfa/",
        { otp_token: otpToken },
        { withCredentials: true }
      );

      if (response.data.status === "mfa_confirmed") {
        alert("MFA has been successfully enabled.");
        window.location.href = "/home";
      } else {
        alert("Failed to confirm MFA. Please check your code.");
      }
    } catch (err) {
      alert("Error confirming MFA. Please try again.");
    }
  };

  if (loading) return <p>Loading MFA setup...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Enable Two-Factor Authentication</h2>
      <p>Scan this QR code with your MFA app (e.g., Google Authenticator):</p>
      {qrCode && (
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="MFA QR Code"
          style={{ margin: "20px auto", width: "200px" }}
        />
      )}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="otp">Enter the code from your app:</label>
        <input
          type="text"
          id="otp"
          value={otpToken}
          onChange={(e) => setOtpToken(e.target.value)}
          placeholder="123456"
          style={{ margin: '10px', padding: '5px' }}
        />
        <button onClick={handleConfirmOtp}>Confirm MFA</button>
      </div>
      <p>If you prefer, you can enter this key manually:</p>
      <code>{otpUri}</code>
    </div>
  );
};

export default MfaSetup;