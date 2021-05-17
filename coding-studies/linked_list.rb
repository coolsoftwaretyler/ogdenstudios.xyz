class LinkedList 
    def initialize
        @head = nil
    end

    Node = Struct.new(:value, :next)

    def head
        return @head
    end

    def tail 
        current = @head 
        
        loop do 
            if current.next.nil?
                return current
            else
                current = current.next
            end
        end
    end

    def insert(value)
        node = Node.new(value, @head)
        @head = node
    end

    def find(value)
        current = @head 

        loop do 
            if current.value == value 
                return current 
            elsif current.next.nil?
                return nil
            else
                current = current.next
            end
        end
    end

    def remove(value)
        previous = nil 
        current = @head 

        loop do 
            if current.value == value 
                newNext = current.next
                previous.next = newNext unless previous.nil?
                break
            elsif current.next.nil?
                return nil 
            else
                previous = current
                current = current.next
            end
        end
    end
end