import Department from "./Department";
function Board({ game, currentDept }) {
  const departmentOrder = [
    { name: "Great Hall", data: game.GreatHall },
    { name: "Session", data: game.Session },
    { name: "Welcome", data: game.Welcome },
    { name: "Interview", data: game.Interview },
  ];

  // Move currentDept to index 1 (top-right)
  const sortedDepartments = (() => {
    const index = departmentOrder.findIndex((dep) => dep.name === currentDept);
    if (index === -1) return departmentOrder;

    const reordered = [...departmentOrder];
    const [current] = reordered.splice(index, 1);
    reordered.splice(1, 0, current);
    return reordered;
  })();

  return (
    <div className="p-3 h-100 w-100">
      <div className="d-grid board-grid gap-3 h-100">
        {sortedDepartments.map((dep) => (
          <Department
            key={dep.name}
            name={dep.name}
            isCurrent={currentDept === dep.name}
            {...dep.data}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
