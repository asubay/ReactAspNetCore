import { useParams } from 'react-router-dom';

function CategoryPage() {
    const { category } = useParams();  

    return (
        <div>
            <h1>{category} Page</h1>           
        </div>
    );
}

export default CategoryPage;