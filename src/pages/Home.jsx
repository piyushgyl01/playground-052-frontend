import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/tools`
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this devTool?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tools/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dev Tools List</h2>
        <Link to="/post" className="btn btn-success">
          Add New Dev Tool
        </Link>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="alert alert-info">
          No Dev Tools found. Add your first dev tool!
        </div>
      )}

      <div className="row">
        {data &&
          data.map((devTool) => (
            <div className="col-md-12 mb-4 list-group" key={devTool._id}>
              <div className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">
                    {devTool.devToolName} by {devTool.devToolBuilder}
                  </h5>
                  <small className="text-body-secondary">
                    {new Date(devTool.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p>{devTool.devToolDesciption}</p>
                <Link
                  to={`/details/${devTool._id}`}
                  className="btn btn-primary me-2 mt-1"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-danger mt-1"
                  onClick={() => handleDelete(devTool._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}