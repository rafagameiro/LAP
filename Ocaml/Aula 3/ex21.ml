type 'a tree = Nil | Node of 'a * 'a tree * 'a tree;;

let rec howMany v t =
	match t with
	 Nil -> 0
	| Node(x,l,r) -> (if x = v then 1 else 0) + howMany v l + howMany v r
;;

let rec eqPairs t =
	match t with
	 Nil -> 0
	| Node((x,y),l,r) -> (if x = y then 1 else 0) + eqPairs l + eqPairs r
;;

let rec treeToList t =
	match t with
	 Nil -> []
	| Node(x,l,r) -> x::(treeToList l)@(treeToList r)
;;
