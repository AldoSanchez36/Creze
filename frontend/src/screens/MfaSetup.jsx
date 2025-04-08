import React, { useEffect, useState } from "react";
import axios from "axios";

const MfaSetup = () => {
  const [qrCode, setQrCode] = useState(null);
  const [otpUri, setOtpUri] = useState(null);
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
      <p>If you prefer, you can enter this key manually:</p>
      <code>{otpUri}</code>
    </div>
  );
};

export default MfaSetup;