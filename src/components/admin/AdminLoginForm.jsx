export default function AdminLoginForm({ password, setPassword, onSubmit, error }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Inloggen</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}