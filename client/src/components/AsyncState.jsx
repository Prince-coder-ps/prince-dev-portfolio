// Handles the loading / error / empty triad so every dynamic section
// doesn't reinvent this logic (see spec section 27).
const AsyncState = ({ loading, error, isEmpty, emptyMessage = 'Nothing here yet.', children }) => {
  if (loading) return <p className="state-message" role="status">Loading…</p>;
  if (error) return <p className="state-message error" role="alert">{error}</p>;
  if (isEmpty) return <p className="state-message">{emptyMessage}</p>;
  return children;
};

export default AsyncState;
