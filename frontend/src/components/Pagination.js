// pass pageCount (number of pages), a paginate function to set the current page, and the currentPage to make it active

function Pagination({ pageCount, paginate, currentPage }) {
  const pageNumbers = []
  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i)
  }

  return (
    <>
      {pageNumbers.map((number) => (
        <li
          key={number}
          className={`page-item ${number === currentPage ? 'active' : ''}`}
        >
          <button className='page-link' onClick={() => paginate(number)}>
            {number}
          </button>
        </li>
      ))}
    </>
  )
}

export default Pagination
