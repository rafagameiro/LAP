(* RegExp module interface *)
(* LAP (AMD 2018) *)

(*
01234567890123456789012345678901234567890123456789012345678901234567890123456789
   80 columns
*)

type regExp =
      Str of string
    | Class of string
    | NClass of string
    | Any
    | Seq of regExp * regExp
    | Or of regExp * regExp
    | Not of regExp
    | Zero of regExp
    | ZeroOrOne of regExp
    | ZeroOrMore of regExp
    | OneOrMore of regExp
    | Repeat of int * int * regExp
;;

val matchAtStart : string -> regExp -> bool * string * string
val firstMatch : string -> regExp -> bool * string * string * string
val allMatches : string -> regExp -> (string * string * string) list
val replaceAllMatches : string -> string -> regExp -> string
val allMatchesFile : string -> regExp -> (string * string * string) list list
val allMatchesOverlap : string -> regExp -> (string * string * string) list
val matchAtStartGreedy : string -> regExp -> bool * string * string
