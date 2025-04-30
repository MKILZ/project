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
      className={`card department-card ${
        isCurrent ? "active" : "inactive"
      } p-2`}
    >
      <h5 className="text-center">{name}</h5>

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
              <div
                className="circle volunteer"
                key={`v-${i}`}
                title="Volunteer"
              ></div>
            ))}
          </div>
        ))}
      </div>

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
    </div>
  );
}

export default Department;
