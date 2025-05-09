function Pagination() {
    return (
        <div className="max-w-[1200px] mx-auto my-2 px-1 flex justify-center items-center gap-1 mt-6">
            <div className="join gap-1">
                <button className="join-item btn btn-outline">Previous page</button>
                <button className="join-item btn">1</button>
                <button className="join-item btn btn-active">2</button>
                <button className="join-item btn">3</button>
                <button className="join-item btn">4</button>
                <button className="join-item btn btn-outline">Next</button>
            </div>
        </div>
    )
}

export default Pagination;