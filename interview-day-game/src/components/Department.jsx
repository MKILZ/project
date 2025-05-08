function Department({
  name,
  tables,
  students,
  volunteers,
  staffNotAvailable,
  extraStaff,
  studentsWaiting,
  exitingTo,
  isCurrent,
}) {
  // Distribute students and volunteers across tables
  const studentsPerTable = Array.from(
    { length: tables },
    (_, i) => Math.floor(students / tables) + (i < students % tables ? 1 : 0)
  );

  const volunteersPerTable = Array.from(
    { length: tables },
    (_, i) =>
      Math.floor(volunteers / tables) + (i < volunteers % tables ? 1 : 0)
  );

  return (
    <div
      className={`card department-card rounded-5 ${
        isCurrent ? "active" : "inactive"
      } p-2`}
    >
      <h5 className="text-center">{isCurrent ? `🌟${name}🌟` : name}</h5>

      <div className="table-grid">
        {Array.from({ length: tables }).map((_, idx) => (
          <div className="table-box" key={idx}>
            {Array.from({ length: studentsPerTable[idx] }).map((_, i) => (
              <div
                className="circle student"
                key={`s-${i}`}
                title="Student"
              ></div>
            ))}
            {Array.from({ length: volunteersPerTable[idx] }).map((_, i) => (
              <div className="triangle" key={`v-${i}`} title="Volunteer"></div>
            ))}
          </div>
        ))}
      </div>
      <div />

      <div className="d-flex flex-column mt-3">
        <div className="d-flex flex-wrap justify-content-between gap-4">
          {/* Summary Stats */}
          <div className="p-3 bg-light rounded shadow-sm border">
            <h6 className="text-muted mb-2">Summary</h6>
            <ul className="list-unstyled small mb-0">
              <li>
                <strong>Extra Volunteers:</strong> {extraStaff}
              </li>
              <li>
                <strong>Staff Not Available:</strong> {staffNotAvailable}
              </li>
              <li>
                <strong>Total Students:</strong> {students}
              </li>
              <li>
                <strong>Total Volunteers:</strong> {volunteers}
              </li>
            </ul>
          </div>

          {/* Students Waiting */}
          <div className="p-3 bg-light rounded shadow-sm border">
            <h6 className="fw-bold small text-primary mb-2">
              Students Waiting
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {Array.from({ length: studentsWaiting }).map((_, i) => (
                <div
                  className="circle student-waiting"
                  key={`w-${i}`}
                  title="Waiting Student"
                ></div>
              ))}
            </div>
          </div>

          {/* Staff Unavailable */}
          <div className="p-3 bg-light rounded shadow-sm border">
            <h6 className="fw-bold small text-danger mb-2">
              Staff Not Available
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {Array.from({ length: staffNotAvailable }).map((_, i) => (
                <div
                  className="circle staff-unavailable"
                  key={`u-${i}`}
                  title="Unavailable Staff"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="fw-bold text-muted mb-2">Exiting To</div>
        <div className="d-flex flex-wrap gap-3">
          {Object.entries(exitingTo)
            .filter(([destination]) => destination !== name)
            .map(([destination, count]) => (
              <div
                className="badge bg-light text-dark border px-3 py-2 rounded d-flex align-items-center shadow-sm"
                key={destination}
              >
                <span className="me-2">→</span>
                <strong className="me-1">{destination}:</strong>
                {count}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Department;
