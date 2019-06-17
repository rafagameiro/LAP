type 'a tree = Nil | Node of 'a * 'a tree * 'a tree;;

let rec height t =
    match t with
       Nil -> 0
     | Node(x,l,r) ->
           1 + max (height l) (height r)
;;

let rec balanced t =
	match t with
	 Nil -> true
	| Node(x,l,r) -> if abs ( height l - height r ) > 1 then false else true
;;
