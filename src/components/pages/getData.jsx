
function GetData() {


  return (
    <div className="px-2 lg:px-0 w-full h-11/12 overflow-x-auto flex flex-row lg:justify-between lg:w-11/12">
      <div className="min-w-[280px] lg:w-[250px] h-full border-2 mx-2 lg:m-0 flex flex-col">
        <div className="flex justify-center items-center border-b-2 h-12">
          <h1>TODO</h1>
        </div>
        <div className="bg-red-700 w-full flex-grow overflow-y-auto  flex flex-col gap-4 p-2"
          style={{ height: "calc(100% - 3rem)" }}
        >
          <div className="h-60 w-full bg-blue-600">scroll-y</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
          <div className="h-60 w-full bg-blue-600">na</div>
        </div>
        

      </div>
      <div className="min-w-[280px] h-full border-2 mx-2 lg:m-0 flex flex-col">
          <h1 className="bg-amber-700 border-b-2 text-center">INPROGRESS</h1>
        </div>
        <div className="min-w-[280px] h-full border-2 mx-2 lg:m-0 flex flex-col">
          <h1 className="bg-amber-700 border-b-2 text-center">DONE</h1>
        </div>
        <div className="min-w-[280px] h-full border-2 mx-2 lg:m-0 flex flex-col">
          <h1 className="bg-amber-700 border-b-2 text-center">BACKLOG</h1>
        </div>
    </div>
  );
}

export default GetData;








 