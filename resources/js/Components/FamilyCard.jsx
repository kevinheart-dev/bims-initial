const FamilyCard = ({ x, y, person, relation }) => {
    return (
        <foreignObject x={x} y={y} width={260} height={160}>
            <div
                className={`bg-white rounded-xl shadow-md border p-3 w-[240px] text-sm space-y-1 transition-all duration-200 hover:shadow-lg hover:border-2
                ${relation === "Self" ? "border-blue-400" : relation === "Spouse" ? "border-pink-400" : "border-gray-200"}`}
            >
                <p className="m-0 leading-tight font-medium">
                    {person?.firstname} {person?.lastname}
                </p>
                <h2 className="m-0 font-semibold text-gray-800">{relation}</h2>
                <button className="m-0 p-0 text-xs text-blue-500 hover:underline">
                    View all details
                </button>
            </div>
        </foreignObject>
    );
};

export default FamilyCard;
