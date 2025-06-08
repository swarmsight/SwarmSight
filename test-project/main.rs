// Test Rust file for SwarmSight scanning
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(42);
    let data_clone = data.clone();
    
    // Potential concurrency issue - sharing mutable data
    let handle = thread::spawn(move || {
        println!("Data: {}", *data_clone);
    });
    
    // Potential memory leak - not joining thread
    println!("Main thread continues...");
    
    // Use after potential move
    println!("Original data: {}", *data);
}

// Function with potential panic
fn divide(a: i32, b: i32) -> i32 {
    a / b  // No check for division by zero
}

// Function with potential buffer overflow
fn unsafe_access(arr: &[i32], index: usize) -> i32 {
    arr[index]  // No bounds checking
}
