import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";

const fetchPosts = async ({ pageParam = 1 }) => {
    const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_limit=10&page=${pageParam}`
    );
    return res.data;
}

const Posts = () => {
    const loadMoreRef = useRef();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, allPages) => lastPage.length < 10 ? undefined : allPages.length + 1
    });
 
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        });
        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    if (status === "loading") return <p>Loading Posts...</p>
    if (status === "error") return <p>Something Went Wrong</p>
    
    
    return (
        <div>
            <h1 className="text-xl font-bold mb-4 text-center">Infinite Scroll with React Query</h1>
            {data?.pages.map((page, i) => (
                <div className="grid grid-cols-2 gap-5" key={i}>
                    {page.map((post)=>(
                        <div key={post.id} className="shadow-md p-10 border-gray-400 rounded-md m-2 hover:bg-gray-50 duration-200 transition-all">
                            <div className="text-center p-5">
                                <FontAwesomeIcon icon={faCogs} className="bg-blue-500 text-2xl p-2 text-white rounded-md shadow-2xl"></FontAwesomeIcon>
                            </div>
                            <p className="font-semibold">{post.title}</p>
                        </div>
                    )) }
                </div>
            ))}
            <div ref={loadMoreRef} className="text-lg text-blue-500 h-10 flex justify-center items-center mt-4">
                {isFetchingNextPage ? <p>Loading More...</p> 
                :
                    !hasNextPage && <p>No more posts</p>
                }
            </div>
        </div>
    )
}

export default Posts;