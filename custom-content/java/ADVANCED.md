
# Java Advanced & Core Deep Dive

## Memory Management

1. Explain the Java Memory Model (JMM).
The JMM defines how threads interact through memory (RAM). It divides memory into **Heap** (Objects) and **Stack** (Method frames, primitives, references). It guarantees **Visibility** (via `volatile` or locks) and **Ordering** (happens-before relationship) to ensure thread safety in concurrent execution.

2. How does Garbage Collection (GC) work?
GC automatically reclaims memory by identifying reachable objects (referenced from GC Roots like stack variables or static fields). Unreachable objects are eligible for cleanup. Common algorithms:
- **Mark-and-Sweep**: Marks live objects, sweeps dead ones.
- **Generational**: Divides Heap into Young (Eden, Survivor) and Old Gen. Most objects die young (minor GC); survivors move to Old Gen (major GC).

3. Types of References in Java?
- **Strong**: Standard `new Object()`. Never collected if reachable.
- **Soft**: Collected only if JVM runs out of memory (good for caches).
- **Weak**: Collected on the next GC cycle if strongly unreachable (Used in `WeakHashMap`).
- **Phantom**: Enqueued when object is finalized (used for cleanup scheduling).

## Multithreading

4. `synchronized` vs `ReentrantLock`?
- **synchronized**: Implicit monitor lock. Easier to use, scoped to block/method. Released automatically.
- **ReentrantLock**: Explicit lock from `java.util.concurrent`. Offers more features: fairness policy (`new ReentrantLock(true)`), `tryLock()` (non-blocking attempt), `lockInterruptibly()`, and ability to lock/unlock across different methods.

5. What is `CompletableFuture`?
Introduced in Java 8, it represents a Future result of an asynchronous computation. Unlike standard `Future`, it can be manually completed, chained (`thenApply`, `thenCompose`), or combined (`allOf`), making it powerful for non-blocking reactive programming.

6. Difference between `Callable` and `Runnable`?
- **Runnable**: `run()` method returns `void` and cannot throw checked exceptions.
- **Callable**: `call()` method returns a generic `V` and can throw checked exceptions. Used with `ExecutorService.submit()`.

## Core & Internals

7. Why is String immutable in Java?
- **Security**: Used in class loading, network connections, etc.
- **Caching**: String Pool relies on immutability.
- **Thread Safety**: Inherently thread-safe, no synchronization needed.
- **HashCode Caching**: Hash is calculated once and cached, great for Map keys.

8. Does `finally` block always execute?
Yes, except in cases like:
- `System.exit()` is called.
- The thread crashes or is killed.
- JVM crashes.
- Infinite loop in `try` block.

9. `equals()` vs `hashCode()` contract.
- If `a.equals(b)` is true, `a.hashCode()` **must** equal `b.hashCode()`.
- If `a.hashCode()` == `b.hashCode()`, `a.equals(b)` is NOT necessarily true (Collision).
- Always override both together to prevent bugs in Hash-based collections (`HashMap`, `HashSet`).

## Collections

10. `ArrayList` vs `LinkedList`?
- **ArrayList**: Backed by dynamic array. Fast random access (`get(i)` is O(1)). Slow insertion/removal in middle (O(n) shift).
- **LinkedList**: Doubly linked list. Slow access (O(n) traversal). Fast insertion/removal (O(1) pointer change).
- **Modern Usage**: `ArrayList` is almost always preferred due to CPU cache locality.

11. `HashMap` Internal Working?
Ideally uses an array of buckets (Linked Lists).
- `put(K,V)`: Calculates hash(K), maps to index. If bucket empty, adds node. If collision, appends to list.
- **Java 8 Improvement**: If bucket size > 8, the Linked List transforms into a **Red-Black Tree** (O(log n) lookup instead of O(n)).

12. `ConcurrentHashMap` vs `Hashtable`?
- **Hashtable**: Locks the entire map for every operation (Thread-safe but slow).
- **ConcurrentHashMap**: Uses bucket-level locking (Segment locking in Java 7, CAS + synchronized on node in Java 8+). Allows concurrent reads and updates to different buckets without blocking.

## Java 8+ Features

13. What is a Default Method in Interface?
Allows interfaces to have method implementations using the `default` keyword. Enabled backward compatibility for existing interfaces (like `List.sort()`) without breaking implementing classes.

14. `map()` vs `flatMap()` in Streams?
- **map**: Transforms one object to another (`T -> R`). A list of 5 strings -> mapped -> list of 5 integers.
- **flatMap**: Transforms one object to a Stream (`T -> Stream<R>`) and flattens the result. List of 5 Lists -> flatMapped -> single List of elements.

15. What are functional interfaces?
Interfaces with exactly one abstract method. Can be implemented using Lambdas. Examples: `Predicate<T>` (boolean test), `Function<T,R>` (transform), `Consumer<T>` (action), `Supplier<T>` (factory).

## OOP Concepts

16. Composition vs Inheritance?
- **Inheritance** ("Is-A"): White-box reuse. Subclass depends on superclass internals. Brittle.
- **Composition** ("Has-A"): Black-box reuse. Class holds reference to another. Flexible (can change behavior at runtime).
- **Principle**: "Favor Composition over Inheritance".

17. Method Overloading vs Overriding?
- **Overloading**: Same name, different parameters (Compile-time polymorphism).
- **Overriding**: Same name/signature in subclass (Runtime polymorphism).

## Exception Handling

18. What is "Try-with-resources"?
Introduced in Java 7. Automates resource management (closing files, sockets, JDBC connections). Any object implementing `AutoCloseable` can be defined in parenthesis:
```java
try (BufferedReader br = new BufferedReader(...)) {
    // read
} // br.close() called automatically
```

19. Checked vs Unchecked Exceptions?
- **Checked (Compile-time)**: Extends `Exception`. Must be caught or declared (`throws`). Examples: `IOException`, `SQLException`.
- **Unchecked (Runtime)**: Extends `RuntimeException`. Programming errors. Examples: `NullPointerException`, `IndexOutOfBoundsException`.

## Design Patterns

20. Singleton Pattern (Thread Safe)?
Best approach: **Enum Singleton** or **Double-Checked Locking**.
```java
public class Singleton {
    private static volatile Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) instance = new Singleton();
            }
        }
        return instance;
    }
}
```
