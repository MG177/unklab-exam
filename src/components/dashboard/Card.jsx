import Modal from '../Modal';

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

export function Card({ onClickFunction, title, date }) {
  return (
    <div
      className="flex flex-row items-center w-full gap-4 p-3 shadow-md cursor-pointer bg-whitePlus rounded-2xl"
      onClick={onClickFunction}
    >
      <div className="flex-1 p-1.5">
        <div className="w-full font-Roboto text-black text-xs">
          {formatDate(date) || 'No Date'}
        </div>
        <div className="w-full  font-Nunito text-black font-black text-xl">
          {title || 'No Title'}
        </div>
      </div>
      <i
        className="pi pi-angle-right text-accent1"
        style={{ fontSize: '1.5rem' }}
      />
    </div>
  );
}

export function NewCard({ setIsCreateNew, handleNew }) {
  const handleCreateNew = () => {
    const title = document.getElementById('input-title').value;
    console.log('create new', title);
    handleNew(title);
  };
  return (
    <div className="flex flex-row items-center justify-between w-full gap-2 p-3 shadow-md bg-whitePlus rounded-2xl">
      <input
        type="text"
        id="input-title"
        placeholder="Title"
        className="w-full p-1.5 rounded-lg "
      />
      <div className="flex flex-row">
        <button className="mx-2" onClick={handleCreateNew}>
          <i
            className="pi pi-check text-accent1"
            style={{ fontSize: '1.5rem' }}
          />
        </button>
        <button className="mx-2" onClick={() => setIsCreateNew(false)}>
          <i
            className="pi pi-trash text-accent1"
            style={{ fontSize: '1.5rem' }}
          />
        </button>
      </div>
    </div>
  );
}

export function EditCard({
  id,
  handleEditQuestion,
  handleDeleteQuestion,
  title,
  date,
}) {
  const handleEdit = () => {
    const newTitle = document.getElementById('input-title').value;
    console.log('Edit ', title, ' to ', newTitle);
    handleEditQuestion(id, newTitle);
  };

  return (
    <div className="flex flex-col items-end justify-between w-full  p-3 gap-1 shadow-md bg-whitePlus rounded-2xl">
      {/* <Modal
        text={{
          title: 'Are you sure you want to delete this question?',
          body: "You can't retrieve this question once you delete it",
          negativeOption: 'Cancel',
          positiveOption: 'Delete',
        }}
        handleFunction={handleModalAction}
      /> */}
      <div className="w-full font-Roboto text-black text-xs">
        {formatDate(date) || 'No Date'}
      </div>
      <div className="flex flex-row w-full gap-2">
        <input
          type="text"
          id="input-title"
          placeholder="Title"
          defaultValue={title}
          className="w-full p-1.5 rounded-lg "
        />
        <div className="flex flex-row">
          <button className="mx-2" onClick={handleEdit}>
            <i
              className="pi pi-check text-accent1"
              style={{ fontSize: '1.5rem' }}
            />
          </button>
          <button className="mx-2" onClick={() => handleDeleteQuestion(id)}>
            <i
              className="pi pi-trash text-accent1"
              style={{ fontSize: '1.5rem' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
