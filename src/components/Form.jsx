import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Form({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    devToolName: "",
    devToolBuilder: "",
    devToolDesciption: "",
  });

  const [apiError, setApiError] = useState(null);

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/tools/${id}`
  );

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        devToolName: data?.devToolName || "",
        devToolBuilder: data?.devToolBuilder || "",
        devToolDesciption: data?.devToolDesciption || "",
      });
    }
  }, [isEdit, data, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);

    try {
      if (isEdit) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tools/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate(`/details/${id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to update startup");
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tools`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const createdChar = await response.json();
          navigate(`/details/${createdChar._id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create new startup");
        }
      }
    } catch (error) {
      console.log(error);
      setApiError("Network error occurred");
    }
  }

  return (
    <>
      {isEdit && loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">
              {isEdit ? "Edit Dev Tool" : "Add New Dev Tool"}
            </h2>

            {(error || apiError) && (
              <div className="d-flex justify-content-center align-items-center">
                <div className="alert alert-danger">{error || apiError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="devToolName" className="form-label">
                  Dev Tool Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="devToolName"
                  id="devToolName"
                  value={formData.devToolName}
                  onChange={(e) =>
                    setFormData({ ...formData, devToolName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="devToolBuilder" className="form-label">
                  Builder
                </label>
                <input
                  className="form-control"
                  name="devToolBuilder"
                  id="devToolBuilder"
                  value={formData.devToolBuilder}
                  onChange={(e) =>
                    setFormData({ ...formData, devToolBuilder: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="devToolDesciption" className="form-label">
                  Description
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="devToolDesciption"
                  id="devToolDesciption"
                  value={formData.devToolDesciption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      devToolDesciption: e.target.value,
                    })
                  }
                  required
                  rows={8}
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <Link
                  to={isEdit ? `/details/${id}` : "/"}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
