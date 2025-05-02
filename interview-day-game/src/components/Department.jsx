function Department({
  name,
  tables,
  students,
  volunteers,
  exits,
  exiting,
  staffNotAvailable,
  extraStaff,
  studentsWaiting,
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
      <h5 className="text-center">{isCurrent ? "🌟" + name + "🌟" : name}</h5>

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
      <div className="d-flex justify-content-between  mt-2">
        <div className="mt-2 small">
          <div>
            Exit: {exiting} / {exits}
          </div>
          <div>Extra Volunteers: {extraStaff}</div>
          <div>Students Waiting: {studentsWaiting}</div>
          <div>Staff Not Available: {staffNotAvailable}</div>
          <div>Total Students: {students}</div>
          <div>Total Volunteers: {volunteers}</div>
        </div>
        <div>
          <div className="students-waiting-box mt-2 p-2">
            <div className="fw-bold small mb-1">Students Waiting</div>
            <div className="d-flex flex-wrap gap-1">
              {Array.from({ length: studentsWaiting }).map((_, i) => (
                <div
                  className="circle student-waiting"
                  key={`w-${i}`}
                  title="Waiting Student"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="staff-unavailable-box mt-2 p-2">
            <div className="fw-bold small mb-1">Staff Not Available</div>
            <div className="d-flex flex-wrap gap-1">
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
    </div>
  );
}

export default Department;
