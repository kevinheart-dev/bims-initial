const FamilyCard = ({ x, y, person, relation }) => {
    return (
        <foreignObject x={x} y={y} width={260} height={160}>
            <div
                className={`bg-white rounded-xl shadow-md border p-3 w-[240px] text-sm transition-all duration-200 hover:shadow-lg hover:border-2
        ${relation === "Self" ? "border-blue-400" : relation === "Spouse" ? "border-pink-400" : "border-gray-200"}`}
            >
                <div className="flex items-start space-x-3">
                    <img
                        src={person?.resident_picture || "/images/default-avatar.jpg"}
                        alt={`${person?.firstname}'s photo`}
                        className="w-14 h-14 rounded-full object-cover border"
                    />

                    {/* Info on the right */}
                    <div className="flex-1 space-y-1">
                        <p className="m-0 leading-tight font-medium">
                            {person?.lastname}, {person?.firstname}{" "}
                            {person?.middlename ? person.middlename.charAt(0) + "." : ""}
                            {person?.suffix ? `, ${person.suffix}` : ""}
                        </p>
                        <h2 className="m-0 font-semibold text-gray-800">{relation}</h2>
                        <button className="m-0 p-0 text-xs text-blue-500 hover:underline">
                            View all details
                        </button>
                    </div>
                </div>
            </div>
        </foreignObject>

    );
};

export default FamilyCard;
