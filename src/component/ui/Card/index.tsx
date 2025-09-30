const Card = ({children, className}: any) => {
    return (
        <div className={`w-full gap-5 p-6 rounded-xl ${className}`}>
            {children}
        </div>
    )
}

export default Card;